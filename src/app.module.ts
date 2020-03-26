import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesGuard } from './guards/role.guard';
import { ImagesModule } from './images/images.module';
import { AlbumsModule } from './albums/albums.module';
import { ContactsModule } from './contacts/contacts.module';
import { AboutModule } from './about/about.module';
import { PriceListModule } from './priceList/priceList.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { UserModule } from './user/user.module';
import { AlbumCategoryModule } from './albumCategory/albumCategory.module';
import { AlbumImageModule } from './albumImage/albumImage.module';

@Module({
  imports: [
    CacheModule.register({ ttl: 10 * 60 }), // 10 minutes
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ImagesModule,
    AlbumsModule,
    ContactsModule,
    AboutModule,
    PriceListModule,
    CategoriesModule,
    FilesModule,
    UserModule,
    AlbumCategoryModule,
    AlbumImageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
