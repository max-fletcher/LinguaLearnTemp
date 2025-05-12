import { BlogRepository } from '../db/nosql/repository/blog.repository';

export class BlogService {
  private blogRepo: BlogRepository;

  constructor() {
    this.blogRepo = new BlogRepository();
  }

  async getFeaturedBlogs(select: string | null = null, limit: number = 5) {
    return await this.blogRepo.getFeaturedBlogs(select, limit);
  }
}
