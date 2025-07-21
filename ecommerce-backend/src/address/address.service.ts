import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address, AddressDocument } from './schemas/address.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AddressService {
  constructor (
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>
  ) {}

  async create(userId: string, CreateDto: CreateAddressDto): Promise<Address>{
    const address = new this.addressModel({
      ...CreateDto,
      user: new Types.ObjectId(userId)
    });
    return address.save()
  }
  async findOne(id: string): Promise<AddressDocument | null> {
    return this.addressModel.findById(id);
  }

  async findAll(userId: string): Promise<AddressDocument[]>{
    return this.addressModel.find({ user: userId }).sort({ createdAt: -1 });

  }
  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto): Promise <AddressDocument>{
    const address = await this.addressModel.findById(id);
  if (!address || address.user.toString() !== userId.toString()) {
  throw new ForbiddenException('Access denied');
  }
    console.log('Address user:', address.user.toString());
    console.log('Logged in userId:', userId.toString());
    Object.assign(address, updateAddressDto);
    return address.save()
  }

  async remove(userId: string, id: string): Promise<void>{
    const address = await this.addressModel.findById(id);
      if(!address || address.user.toString() !== userId){
      throw new ForbiddenException('access denied')
    }
    console.log('Address owner:', address.user.toString());

    await address.deleteOne();
  }
}
