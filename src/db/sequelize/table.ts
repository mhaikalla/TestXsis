import {
    Movies
  } from '../../models/index';
  
  import { DataTypes, Model, Optional, CreationOptional, NOW, ModelDefined } from 'sequelize';
  import { getDb, getDataTypesChaining as _ } from '../sequelize/index';
  
  const defaultSetting = {
    underscored: true,
  };
  const extraAttributes = {
    created_at: DataTypes.NOW,
    updated_at: _(DataTypes.DATE).withDefault(DataTypes.NOW),
  }
  
  export const MoviesTable = getDb().define<Model<Movies>>('movies', {
    id: _(DataTypes.NUMBER).asPrimaryKey(),
    title: _(DataTypes.STRING),
    description : _(DataTypes.STRING),
    rating : _(DataTypes.FLOAT),
    image : _(DataTypes.STRING),
    ...extraAttributes
  }, {...defaultSetting, freezeTableName: true})
  