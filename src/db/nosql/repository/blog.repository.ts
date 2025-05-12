import BlogModel from '../model/blog.model';

export class BlogRepository {
  async getFeaturedBlogs(select: string | null = null, limit: number = 5) {
    if (select) {
      return await BlogModel.find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(select)
        .lean();
    }

    return await BlogModel.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}
