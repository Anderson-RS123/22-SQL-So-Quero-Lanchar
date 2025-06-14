import { Router } from 'express';
import { registerEmpresa, loginEmpresa } from '../controllers/empresa.controller';

const router = Router();

router.post('/register', registerEmpresa); // Rota para registrar uma nova empresa
router.post('/login', loginEmpresa);     // Rota para fazer login da empresa

export default router;
