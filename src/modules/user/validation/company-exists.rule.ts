import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CompanyService } from "../../company/services/company.service";

@ValidatorConstraint({ name: 'CompanyExists', async: true })
@Injectable()
export class CompanyExistsRule implements ValidatorConstraintInterface {
    constructor(private companyService: CompanyService) { }

    async validate(name: string) {
        const company = await this.companyService.findOneByName(name);
        if (company)
            return false;
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `El estudio ya existe`;
    }
}