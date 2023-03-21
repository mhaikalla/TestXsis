import { QueryFilter,QueryFilterParam } from "./QueryFilter"
export interface Movies {
  id  :  number,
  title : string
  description : string,          
  rating : number,
  image : string
  created_at : Date
  updated_at : Date
}

export class MovieFilter extends QueryFilter<Movies> {
  title? : string
  desciption? : string
  rating? : number
  rating_from? : number
  rating_to? : number
  constructor(
    filter: QueryFilterParam<Movies>,
    title? : string,
    desciption? : string,
    rating? : number,
    rating_from? : number,
    rating_to? : number
  ) {
    super(filter);
    this.title = title,
    this.desciption = desciption,
    this.rating = rating
    this.rating_from = rating_from,
    this.rating_to = rating_to
  }
}
