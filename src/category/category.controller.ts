import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthorGuard } from 'src/guard/author.guard'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoryController {
	categoryRepository: any
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	create(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
		return this.categoryService.create(createCategoryDto, +req.user.id)
	}
	// AuthorGuard
	@Get()
	@UseGuards(JwtAuthGuard)
	async findAll(@Req() req) {
		return this.categoryService.findAll(+req.user.id)
	}

	@Get(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	async findOne(@Param('id') id: string) {
		return this.categoryService.findOne(+id)
	}
	@UseGuards(JwtAuthGuard, AuthorGuard)
	// @Patch(':type/:id')
	// update(
	// 	@Param(':type/:id') id: string,
	// 	@Body() updateCategoryDto: UpdateCategoryDto,
	// ) {
	// 	return this.categoryService.update(+id, updateCategoryDto)
	// }
	@Patch(':type/:id')
	update(
		@Param('id') id: string,
		@Param('type') type: string,

		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.categoryService.update(+id, updateCategoryDto)
	}

	@Delete(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	remove(@Param('id') id: string) {
		return this.categoryService.remove(+id)
	}
}
