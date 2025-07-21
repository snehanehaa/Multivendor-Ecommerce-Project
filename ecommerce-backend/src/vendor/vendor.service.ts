import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor, VendorDocument } from './schemas/vendor.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class VendorService {

    constructor(  @InjectModel(Vendor.name) private vendormodel: Model<VendorDocument>,
    @InjectModel( User.name) private userModel: Model<UserDocument> ){}

 // 1. Get vendor profile 
      async getProfile(userId: string): Promise<VendorDocument | null>{
        const profile = await this.vendormodel.findOne({ user: userId })
        if(!profile) throw new NotFoundException('vendor profile not found')
            return profile
      }
 // 2. Update vendor profile
      async updateProfile(userId: string, data: Partial<Vendor>): Promise<VendorDocument>{
        const updated = await this.vendormodel.findOneAndUpdate({user: userId } , data,{
            new: true,
            upsert: true,
        });
        return updated;
      }
  // 3. Upload KYC document
     async uploadKyc(userId: string, kycUrl: string): Promise<VendorDocument>{
        const vendor = await this.vendormodel.findOneAndUpdate({user: userId}, { kycDocumentUrl: kycUrl}, {new: true})
        if(!vendor) throw new NotFoundException('vendor profile not found')
            return vendor;
     }
 // 4. Get all vendor applications
     async getAllVendor(): Promise<VendorDocument[]>{
        return this.vendormodel.find().populate('user', 'email role is approved')
     }
 // 5. Approve/reject vendor
     async approveVendor(id: string, status: 'approved' | 'rejected'): Promise<VendorDocument> {
    const vendor = await this.vendormodel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!vendor) throw new NotFoundException('Vendor not found');
  
    await this.userModel.findByIdAndUpdate(vendor.user, {
      isApproved: status === 'approved',
    });

    return vendor;
  }
    }

      











