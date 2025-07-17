import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  createCategory(@Body() createDto: CreateCategoryDto){
    return this.categoryService.create(createDto)
  }
  @Get()
  getAllCategory(){
    return this.categoryService.findAll()
  }
  @Put(':id')
  updateCategory(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto){
    return this.categoryService.update(id, updateDto)
  }
  @Delete(':id')
  deleteCategory( @Param('id') id: string){
    return this.categoryService.remove(id)
  }
}
