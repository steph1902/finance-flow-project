import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';

let app: NestFastifyApplication;

export default async function handler(req: any, res: any) {
    if (!app) {
        app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter()
        );
        app.enableCors({
            origin: '*', // Allow all origins for now to ensure frontend can connect
            credentials: true,
        });
        app.setGlobalPrefix('api/v1'); // Ensure prefix matches
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    }

    // Handle the request
    app.getHttpAdapter().getInstance().server.emit('request', req, res);
}
