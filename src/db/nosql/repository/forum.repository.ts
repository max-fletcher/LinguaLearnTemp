import ForumCommentModel from '../model/forum-comment.model';
import ForumModel from '../model/forum.model';

export class ForumRepository {
  async getFeaturedForums(select: string | null = null, limit: number = 5) {
    if (select) {
      return await ForumModel.find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select(select)
        .lean();
    }

    return await ForumModel.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getCommentCount(uniqueId: string) {
    return await ForumCommentModel.countDocuments({ forumId: uniqueId });
  }
}
