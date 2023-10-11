import { Role } from 'src/common/roles.enum';

export interface UserActiveInterface extends Request {
  email: string;
  role: Role;
}
