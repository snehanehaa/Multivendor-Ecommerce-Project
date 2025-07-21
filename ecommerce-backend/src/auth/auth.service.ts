import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtservice: JwtService,
         
    ) {}
//register a new customer
    async registerCustomer(data: any){
        return this.usersService.createUser({ ...data, role: 'customer'})
    }
//register a new admin
    async registerAdmin(data: any){
      return this.usersService.createUser({ ...data, role: 'admin'})
    }
//register a new vendor
    async registerVendor(data: any){
        return this.usersService.createUser({ ...data, role: 'vendor'})
    }
//login user and return jwt
    async login(email: string, password: string) {
      const user = await this.usersService.findByEmail(email);
      if (!user) throw new UnauthorizedException('invalid credential');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('invalid credential');

      const payload = { sub: user._id, role: user.role };
      const token = await this.jwtservice.signAsync(payload);

      return { access_token: token };
    }

// Forgot password - generate reset token
    async forgotPassword(email: string){
      const token = await this.usersService.generateResetToken(email);
      return { message: 'reset token generated', token}
    }
//reset password
    async resetPassword(token: string, newPassword: string): Promise<boolean> {
      return this.usersService.resetPassword(token, newPassword);
    }

// verification
    async sendVerificationToken(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
   const token = await this.usersService.generateEmailVerificationToken(userId);
    return { message: 'Verification token sent' };
   }
//verify email
    async verifyEmail(token: string){
      return this.usersService.verifyEmail(token)
    }
//get current user
    async getme( userId: string){
      return this.usersService.findById(userId)
    }
// logout
    logout() {
    return { message: 'Logged out successfully.' };
}

}
