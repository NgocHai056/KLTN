import { Controller } from '@nestjs/common';
import { VersionEnum } from 'src/utils.common/utils.enum/utils.version.enum';

@Controller({ version: VersionEnum.V1.toString(), path: 'auth/qr' })
export class QrController { }
