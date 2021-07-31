import { Test, TestingModule } from '@nestjs/testing';
import { VolunteersService } from './volunteers.service';

describe('VolunteersService', () => {
  let service: VolunteersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: VolunteersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<VolunteersService>(VolunteersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
