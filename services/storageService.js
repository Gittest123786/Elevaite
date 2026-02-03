import { CandidateSchema, ClientSchema } from '../datastore.js';

const TALENT_POOL_KEY = 'career_lift_talent_pool';
const CLIENTS_KEY = 'elevaite_clients_pool';

export const storageService = {
  saveCandidate: (profile) => {
    // Validate profile before storage
    const parseResult = CandidateSchema.safeParse(profile);
    if (!parseResult.success) {
      console.warn("Storage Validation Error:", parseResult.error.format());
    }
    
    const dataToSave = parseResult.success ? parseResult.data : profile;
    const pool = storageService.getTalentPool();
    const index = pool.findIndex(p => p.contact === dataToSave.contact);
    
    if (index > -1) {
      pool[index] = { ...pool[index], ...dataToSave, updatedAt: Date.now() };
    } else {
      pool.push({ 
        ...dataToSave, 
        id: dataToSave.id || `cand_${Date.now()}`, 
        createdAt: dataToSave.createdAt || Date.now(), 
        updatedAt: Date.now() 
      });
    }
    
    localStorage.setItem(TALENT_POOL_KEY, JSON.stringify(pool));
  },

  getTalentPool: () => {
    const data = localStorage.getItem(TALENT_POOL_KEY);
    return data ? JSON.parse(data) : [];
  },

  updateCandidateStatus: (contact, updates) => {
    const pool = storageService.getTalentPool();
    const index = pool.findIndex(p => p.contact === contact);
    if (index > -1) {
      pool[index] = { ...pool[index], ...updates, updatedAt: Date.now() };
      localStorage.setItem(TALENT_POOL_KEY, JSON.stringify(pool));
    }
  },

  getClients: () => {
    const data = localStorage.getItem(CLIENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveClient: (client) => {
    const parseResult = ClientSchema.safeParse(client);
    const dataToSave = parseResult.success ? parseResult.data : client;
    
    const clients = storageService.getClients();
    const index = clients.findIndex(c => c.id === dataToSave.id);
    if (index > -1) {
      clients[index] = dataToSave;
    } else {
      clients.push(dataToSave);
    }
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  },

  getVacancies: () => {
    const clients = storageService.getClients();
    return clients.flatMap(c => c.activeMandates || []);
  },

  placeCandidateWithClient: (candidateContact, clientId, placementFee) => {
    const pool = storageService.getTalentPool();
    const clients = storageService.getClients();
    
    const cIndex = pool.findIndex(p => p.contact === candidateContact);
    const clIndex = clients.findIndex(cl => cl.id === clientId);

    if (cIndex > -1 && clIndex > -1) {
      pool[cIndex].placedWithClientId = clientId;
      pool[cIndex].placementDate = Date.now();
      pool[cIndex].currentStage = 5; 

      clients[clIndex].totalBusinessBrought = (clients[clIndex].totalBusinessBrought || 0) + placementFee;
      clients[clIndex].placementsCount = (clients[clIndex].placementsCount || 0) + 1;

      localStorage.setItem(TALENT_POOL_KEY, JSON.stringify(pool));
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    }
  }
};