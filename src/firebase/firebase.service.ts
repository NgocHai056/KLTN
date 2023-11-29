import * as admin from 'firebase-admin';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService {
    private storage: admin.storage.Storage;

    constructor() {
        const adminConfig: ServiceAccount = {
            "projectId": process.env.FIREBASE_PROJECT_ID,
            "privateKey": process.env.FIREBASE_PRIVATE_KEY,
            "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
        };

        admin.initializeApp({
            credential: admin.credential.cert(adminConfig),
            storageBucket: process.env.STORAGE_BUCKET_URL
        });

        this.storage = admin.storage();
    }

    async uploadImageToFirebase(file): Promise<string> {
        try {
            const bucket = this.storage.bucket();

            /** Tạo đường dẫn lưu trữ trên Firebase */
            const firebaseFilePath = `images/${Date.now()}_${file.originalname}`;

            /** Upload file lên Firebase Storage từ buffer */
            await bucket.file(firebaseFilePath).save(file.buffer, {
                metadata: {
                    contentType: file.mimetype /** Sử dụng contentType từ file được upload */
                }
            });

            return `https://firebasestorage.googleapis.com/v0/b/cinema-707d7.appspot.com/o/${firebaseFilePath}?alt=media`;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteFileFromFirebaseStorage(fileUrl: string): Promise<void> {
        try {

            const startIndex = fileUrl.indexOf('images/');
            if (startIndex !== -1) {
                const endIndex = fileUrl.indexOf('?alt=media');
                const extractedString = fileUrl.substring(startIndex, endIndex !== -1 ? endIndex : undefined);

                /** Tạo một đối tượng File từ URL */
                const file = this.storage.bucket().file(extractedString);

                const [exists] = await file.exists();

                if (exists)
                    /** Xóa file từ Firebase Storage */
                    await file.delete();
            }

        } catch (error) {
            throw new Error(error);
        }
    }
}
