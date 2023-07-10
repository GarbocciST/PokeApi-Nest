import { Module } from '@nestjs/common';
import { AxioAdapter } from './adapters/axios.adapter';

@Module({
    providers:[ AxioAdapter ],
    exports:[ AxioAdapter ]
})
export class CommonModule {}
