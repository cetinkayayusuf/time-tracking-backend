import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateTagDto } from '../src/tag/dto';
import { CreateProjectDto, EditProjectDto } from '../src/project/dto';
import { CreateWorkDto, EditWorkDto } from '../src/work/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'abc@gmail.com',
      password: 'abc',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Cem',
          email: 'aa@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Tags', () => {
    describe('Get empty tags', () => {
      it('should get tags', () => {
        return pactum
          .spec()
          .get('/tags')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create tag', () => {
      it('should create tag', () => {
        const dto: CreateTagDto = {
          title: '1th tag',
        };
        return pactum
          .spec()
          .post('/tags')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('tagId', 'id');
      });
    });
    describe('Get tags', () => {
      it('should get tags', () => {
        return pactum
          .spec()
          .get('/tags')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get tag by id', () => {
      it('should get tag by id', () => {
        return pactum
          .spec()
          .get('/tags/{id}')
          .withPathParams('id', '$S{tagId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{tagId}');
      });
    });
    describe('Delete tag by id', () => {
      it('should delete tag by id', () => {
        return pactum
          .spec()
          .delete('/tags/{id}')
          .withPathParams('id', '$S{tagId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get tags', () => {
        return pactum
          .spec()
          .get('/tags')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });

  describe('Projects', () => {
    describe('Get empty projects', () => {
      it('should get projects', () => {
        return pactum
          .spec()
          .get('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create project', () => {
      it('should create project', () => {
        const dto: CreateProjectDto = {
          title: '1th project',
          description: 'random project description',
        };
        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('projectId', 'id');
      });
    });

    describe('Get projects', () => {
      it('should get projects', () => {
        return pactum
          .spec()
          .get('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get project by id', () => {
      it('should get project by id', () => {
        return pactum
          .spec()
          .get('/projects/{id}')
          .withPathParams('id', '$S{projectId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{projectId}');
      });
    });

    describe('Edit project by id', () => {
      const dto: EditProjectDto = {
        title: 'updated project title',
        description: 'updated description',
      };
      it('should edit project by id', () => {
        return pactum
          .spec()
          .patch('/projects/{id}')
          .withPathParams('id', '$S{projectId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete project by id', () => {
      it('should delete project by id', () => {
        return pactum
          .spec()
          .delete('/projects/{id}')
          .withPathParams('id', '$S{projectId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get projects', () => {
        return pactum
          .spec()
          .get('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });

  describe('Works', () => {
    describe('Get empty works', () => {
      it('should get works', () => {
        return pactum
          .spec()
          .get('/works')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create work', () => {
      let projectId: number;
      it('should create project', () => {
        const dto: CreateProjectDto = {
          title: '1th project',
          description: 'random project description',
        };
        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .toss()
          .then((response) => {
            projectId = response.body.id;
          });
      });

      it('should create work', () => {
        const dto: CreateWorkDto = {
          title: '1th work',
          start: new Date('August 19, 1975 23:15:30 GMT+11:00').toString(),
          end: new Date('August 19, 1975 23:15:30 GMT+11:00').toString(),
          projectId: projectId,
        };
        return pactum
          .spec()
          .post('/works')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('workId', 'id');
      });
    });

    describe('Get works', () => {
      it('should get works', () => {
        return pactum
          .spec()
          .get('/works')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get work by id', () => {
      it('should get work by id', () => {
        return pactum
          .spec()
          .get('/works/{id}')
          .withPathParams('id', '$S{workId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{workId}')
          .inspect();
      });
    });

    describe('Edit work by id', () => {
      const dto: EditWorkDto = {
        title: 'updated work title',
        start: new Date('September 19, 1940 23:15:30 GMT+11:00').toString(),
      };
      it('should edit work by id', () => {
        return pactum
          .spec()
          .patch('/works/{id}')
          .withPathParams('id', '$S{workId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(new Date(dto.start));
      });
    });
    describe('Delete work by id', () => {
      it('should delete work by id', () => {
        return pactum
          .spec()
          .delete('/works/{id}')
          .withPathParams('id', '$S{workId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get works', () => {
        return pactum
          .spec()
          .get('/works')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
