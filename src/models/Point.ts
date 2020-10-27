import {Column} from "typeorm";

export default class Point {

    @Column()
    type: string = 'Point';

    @Column({length: 2})
    coordinates: Array<number>;

}
