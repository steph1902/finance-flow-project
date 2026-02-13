import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ExperimentManager, ExperimentConfig } from '../experiment-manager';

describe('ExperimentManager', () => {
    let experimentManager: ExperimentManager;
    let mockDb: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create mock DB client
        mockDb = {
            aIExperiment: {
                create: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                findMany: jest.fn(),
            },
            aIExperimentResult: {
                findFirst: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
        };

        // Inject mock DB
        experimentManager = new ExperimentManager(mockDb);
    });

    describe('createExperiment', () => {
        it('should create a new experiment', async () => {
            const config: ExperimentConfig = {
                name: 'Test Experiment',
                controlPrompt: 'Control',
                variantPrompt: 'Variant',
            };

            const mockExperiment = { id: 'exp-1', name: 'Test Experiment' };
            mockDb.aIExperiment.create.mockResolvedValue(mockExperiment);

            const result = await experimentManager.createExperiment(config);

            expect(mockDb.aIExperiment.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    name: 'Test Experiment',
                    status: 'RUNNING',
                    trafficSplit: 50,
                }),
            });
            expect(result).toBe('exp-1');
        });
    });

    describe('assignVariant', () => {
        it('should return existing variant if user already assigned', async () => {
            mockDb.aIExperiment.findUnique.mockResolvedValue({ id: 'exp-1', status: 'RUNNING', trafficSplit: 50 });
            mockDb.aIExperimentResult.findFirst.mockResolvedValue({ variant: 'variant' });

            const variant = await experimentManager.assignVariant('exp-1', 'user-1');

            expect(variant).toBe('variant');
            expect(mockDb.aIExperimentResult.findFirst).toHaveBeenCalled();
        });

        it('should return new variant based on traffic split', async () => {
            mockDb.aIExperiment.findUnique.mockResolvedValue({
                id: 'exp-1',
                status: 'RUNNING',
                trafficSplit: 100 // Force variant
            });
            mockDb.aIExperimentResult.findFirst.mockResolvedValue(null);

            const variant = await experimentManager.assignVariant('exp-1', 'user-1');

            expect(variant).toBe('variant');
        });
    });

    describe('recordResult', () => {
        it('should record result if experiment is running', async () => {
            mockDb.aIExperiment.findUnique.mockResolvedValue({ id: 'exp-1', status: 'RUNNING' });

            await experimentManager.recordResult('exp-1', 'user-1', 'variant', {
                requestData: { foo: 'bar' },
                responseData: { baz: 'qux' },
                responseTimeMs: 100
            });

            expect(mockDb.aIExperimentResult.create).toHaveBeenCalled();
        });

        it('should throw error on invalid JSON', async () => {
            mockDb.aIExperiment.findUnique.mockResolvedValue({ id: 'exp-1', status: 'RUNNING' });

            const circular: any = { self: {} };
            circular.self = circular;

            await expect(experimentManager.recordResult('exp-1', 'user-1', 'variant', {
                requestData: circular,
                responseData: {},
                responseTimeMs: 100
            })).rejects.toThrow('Invalid JSON');
        });
    });
});
