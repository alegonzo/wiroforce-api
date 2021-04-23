import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>
    ) { }

    findOne(id: number): Promise<Company> {
        return this.companyRepository.findOne(id);
    }

    findOneByName(name: string): Promise<Company> {
        return this.companyRepository.findOne({ where: { name: name } });
    }

    create(name: string): Promise<Company> {
        return this.companyRepository.save(new Company({ name }));
    }

}
