import { Router } from 'express';
import { getEventos } from '../controllers/evento.controller';
import { protect } from '../middleware/auth.middleware'; // Importe o middleware de proteção

const router = Router();

// Rota protegida: só empresas logadas podem buscar seus eventos
router.get('/', protect, getEventos); // GET /api/eventos

export default router;