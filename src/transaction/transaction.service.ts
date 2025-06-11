import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly transactionRepository: Repository<Transaction>,
	) {}
	async create(createTransactionDto: CreateTransactionDto, id: number) {
		const newTransaction = {
			title: createTransactionDto.title,
			amount: createTransactionDto.amount,
			type: createTransactionDto.type,
			Category: { id: +createTransactionDto.category },
			user: { id },
		}
		// if(!newTransaction) throw new BadRequestException('Samething went wrong ...')
		// return await this.transactionRepository.save(newTransaction)
		if (!createTransactionDto) {
			throw new BadRequestException('Transaction data is missing.')
		}
	}

	async findAll(id: number) {
		const transaction = await this.transactionRepository.find({
			where: {
				user: { id },
			},
			order: {
				createdAt: 'DESC',
			},
			relations: {
				category: true,
			},
		})
		// if (!transaction) throw new NotFoundException('transaction not found')

		return transaction
	}

	async findOne(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: {
				id,
			},
		})
		return `This action returns a #${id} transaction`
	}

	// async update(id: number, updateTransactionDto: UpdateTransactionDto) {
	//   const transaction = await this.transactionRepository.findOne({
	//     where: {id},
	//   })
	//   if (!transaction) throw new NotFoundException('transaction not faund ')

	// 	return await this.transactionRepository.update(id, updateTransactionDto)
	// }
	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})

		if (!transaction) throw new NotFoundException('Transaction not found')

		return await this.transactionRepository.update(id, updateTransactionDto)
	}

	async remove(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})
		if (!transaction) throw new NotFoundException('Transaction not found')
		return await this.transactionRepository.delete(id)
	}

	async findAllWithPagination(id: number, page: number, limit: number) {
		const [transactions, total] =
			await this.transactionRepository.findAndCount({
				where: {
					user: { id },
				},
				skip: (page - 1) * limit,
				take: limit,
				relations: {
					category: true,
					user: true,
				},
				order: {
					createdAt: 'DESC',
				},
			})
			return {
  items: transactions,
  total,
}
		// return transactions

		
		// return {
		//   data: transactions,
		//   total,
		//   page,
		//   lastPage: Math.ceil(total / limit),
		// }
	}
	async findAllByType(id: number, type: string) {
		const transaction = await this.transactionRepository.find({
			where: {
				user: { id },
				type,
			},
		})
		const total = transaction.reduce((acc, obj) => acc + obj.amount, 0)
    return total
	}
}
