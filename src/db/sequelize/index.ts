import { Sequelize, DataTypes , ModelAttributeColumnOptions } from 'sequelize';
require('dotenv').config();

let Db: Sequelize | null

export function getDb(): Sequelize {
    if (!Db) {
        Db = new Sequelize(process.env.DATABASE_URL || "", { define: { timestamps: false } })
    }
    return Db
}

export type DataTypesChaining = {
    asPrimaryKey(isAutoIncrement?: boolean): DataTypesChaining
    isNullable(): DataTypesChaining
    withDefault(defaultValue: any): DataTypesChaining

} & ModelAttributeColumnOptions

export function getDataTypesChaining(type: DataTypes.DataType, attributes?: ModelAttributeColumnOptions): DataTypesChaining {
    attributes = attributes || {} as ModelAttributeColumnOptions
    const columnAtribute: ModelAttributeColumnOptions = {
        ...attributes
    }
    columnAtribute.type = type
    const asPrimaryKey = (isAutoIncrement?: boolean) => {
        return getDataTypesChaining(columnAtribute.type, {
            ...columnAtribute,
            primaryKey: true,
            autoIncrement: isAutoIncrement || false
        })
    }
    const isNullable = () => {
        return getDataTypesChaining(columnAtribute.type, {
            ...columnAtribute,
            allowNull: true
        })
    }
    const withDefault = (defaultValue: any) => {
        return getDataTypesChaining(columnAtribute.type, {
            ...columnAtribute,
            defaultValue
        })
    }



    return {
        asPrimaryKey,
        isNullable,
        withDefault,
        ...columnAtribute,
    }
}