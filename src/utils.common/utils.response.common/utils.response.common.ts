/* eslint-disable @typescript-eslint/ban-types */
import { HttpStatus } from "@nestjs/common";

export class ResponseData {
    private status: HttpStatus;
    private message: string;
    private total_record: number;
    private data: Object;

    constructor(
        status: number = null,
        message: string = null,
        data?: Object,
        totalRecord?: number,
    ) {
        this.status = status ? +status : +HttpStatus.OK;
        this.message = message ? message : "SUCCESS";
        this.total_record = totalRecord ? +totalRecord : 0;
        this.data = data ? data : null;
    }

    public getStatus(): HttpStatus {
        return this.status;
    }

    public setStatus(status: HttpStatus): void {
        this.status = status;
    }

    public getMessage(): string {
        return this.message;
    }

    public setMessage(status: HttpStatus, message: string): void {
        if (message) {
            this.message = message;
        } else {
            switch (status) {
                case HttpStatus.OK:
                    this.message = "SUCCESS";
                    break;
                case HttpStatus.BAD_REQUEST:
                    this.message = "Dữ liệu không hợp lệ";
                    break;
                default:
                    this.message = "SUCCESS";
                    break;
            }
        }
    }

    public getData(): Object {
        return this.data;
    }

    public setData(data: Object): void {
        this.data = data;
    }

    public getTotalRecord(): Object {
        return this.total_record;
    }

    public setTotalRecord(totalRecord: number): void {
        this.total_record = totalRecord ? +totalRecord : 0;
    }
}
