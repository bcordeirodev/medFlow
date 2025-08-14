import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { MedicinesModule } from "./medicines/medicines.module";
import { PatientsModule } from "./patients/patients.module";
import { PrescriptionsModule } from "./prescriptions/prescriptions.module";
import { CidsModule } from "./cids/cids.module";
import { AppointmentsModule } from "./appointments/appointments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "medflow",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    AuthModule,
    UsersModule,
    MedicinesModule,
    PatientsModule,
    PrescriptionsModule,
    CidsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
