import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor ( @InjectModel(Category.name) 
    private categoryModel: Model<CategoryDocument>,
) {}
    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument>{
        const newCategory = new this.categoryModel(createCategoryDto)
        return newCategory.save()
    }
    async findAll(): Promise<CategoryDocument[]>{
        return this.categoryModel.find().populate('parent')
    }
    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument>{
        const updated = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
            new: true,
        })
        if (!updated) throw new NotFoundException('category not found')
            return updated;
    }
    async remove(id: string): Promise<void>{
        const result = await this.categoryModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('category not found')
    }

}
