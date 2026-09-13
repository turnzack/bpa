import { TenantContext } from '../services/tenantService';

declare global {
    namespace Express {
        interface Request {
            tenant?: TenantContext;
        }
    }
}
