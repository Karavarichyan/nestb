import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthorGuard } from 'src/guard/author.guard'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { TransactionService } from './transaction.service'

@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
		return this.transactionService.create(
			createTransactionDto,
			+req.user.id,
		)
	}

	@Get(':type/find')
	@UseGuards(JwtAuthGuard)
	FindAllByType(@Req() req ,@Param('type') type:string) {
		console.log(req);
 return this.transactionService.findAllByType(+req.user.id, type)
	}
	@Get('pagination')
	@UseGuards(JwtAuthGuard)
	findAllWithPagination(
		@Req() req,
		@Query('page') page: number = 20,
		@Query('limit') limit: number = 30,
	) {
		// const userId = +req.user.id;
		return this.transactionService.findAllWithPagination(
			+req.user.id,
			+page,
			+limit,
		)
	}

	@Get()
	@UseGuards(JwtAuthGuard, AuthorGuard)
	findAll(@Req() req) {
		return this.transactionService.findAll(+req.user.id)
	}

	@Get(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	findOne(@Param('id') id: string) {
		return this.transactionService.findOne(+id)
	}

	@Patch(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	update(
		@Param('id') id: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
	) {
		return this.transactionService.update(+id, updateTransactionDto)
	}

	@Delete(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	remove(@Param('id') id: string) {
		return this.transactionService.remove(+id)
	}

	// @Get ('pagination')
	// 	@UseGuards(JwtAuthGuard)
	//   findAllWithPagineshon(@Req() req, @Query( 'page' page:number , @Query ('Limit' Limit:number): Promise<Transaction[]>)){
	//     return this.transactionService.findAllWithPagineshon(+req.user.id, + page , + Limit)
	//   }
}
