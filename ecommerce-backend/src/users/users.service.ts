import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

// 1. Create a new user
  async createUser(data: Partial<User>): Promise<User> {
    if (!data.password) {
    throw new Error('Password is required');
  }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({
      ...data,
      password: hashedPassword,
    });
    return newUser.save();
  }

// 2. Find a user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

// 3. Find a user by ID
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

// 4. Admin approves/rejects a vendor
  async approveVendor(id: string, approved: boolean): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { isApproved: approved }, { new: true });
  }

// 5. Generate forgot password token
  async generateResetToken(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new Error('user not found');
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();
    return token;
  }

 
// 6. Reset password using token
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    console.log(' Reset token:', token); 

    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log('User not found or token expired'); 
      throw new Error('Invalid or expired token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful'); 

    return true;
  }


  // 7. Generate email verification token
  async generateEmailVerificationToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(16).toString('hex');

  const updatedUser = await this.userModel.findByIdAndUpdate(
    userId,
    { emailVerificationToken: token },
    { new: true } 
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  console.log('Generated verification token:', token);
  return token;
}


  // 8. Verify email using token
  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.userModel.findOne({ emailVerificationToken: token });
    if (!user) throw new Error('invalid token');
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    return true;
  }

  // 9. Get all vendors (for admin dashboard)
  async getAllVendors(): Promise<UserDocument[]> {
    return this.userModel.find({ role: 'vendor' }).exec();
  }

  // 10. Update user password with old password
  async updatePasssword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('user not found');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('current password is incorrect');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }

  // 11. Basic profile update
  async updateProfile(id: string, data: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
}
