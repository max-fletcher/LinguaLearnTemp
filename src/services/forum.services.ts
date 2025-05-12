import { ForumRepository } from '../db/nosql/repository/forum.repository';
import { AdminUserRepository } from '../db/rdb/repositories/admin-user.repository';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { THomepageForumBeforeFormatting } from '../types/forum.types';
// import { TForum } from '../types/forum.types';

export class ForumService {
  private forumRepo: ForumRepository;
  private adminUserRepo: AdminUserRepository;
  private appUserRepo: AppUserRepository;

  constructor() {
    this.forumRepo = new ForumRepository();
    this.adminUserRepo = new AdminUserRepository();
    this.appUserRepo = new AppUserRepository();
  }

  async getFeaturedForums(select: string | null = null, limit: number = 5) {
    const featuredForums = (await this.forumRepo.getFeaturedForums(
      select,
      limit,
    )) as unknown as THomepageForumBeforeFormatting[];

    let adminUserIds = featuredForums.map((forum) => forum.adminUserId!);
    adminUserIds = [...new Set(adminUserIds)];
    const adminUsers = await this.adminUserRepo.findUserByIds(adminUserIds);
    const memoizedAdminUsers: any = {};
    adminUsers.map((adminUser) => {
      memoizedAdminUsers[adminUser.id] = {
        id: adminUser.id,
        name: adminUser.name,
        username: adminUser.username,
        avatar: adminUser.avatar,
      };
    });

    let appUserIds = featuredForums.map((forum) => forum.userId!);
    appUserIds = [...new Set(appUserIds)];
    const appUsers = await this.appUserRepo.findUserByIds(appUserIds);
    const memoizedAppUsers: any = {};
    appUsers.map((appUser) => {
      memoizedAppUsers[appUser.id] = {
        id: appUser.id,
        name: appUser.name,
        username: appUser.username,
        avatar: appUser.avatar_url,
      };
    });

    const updatedFeaturedForums = await Promise.all(
      featuredForums.map(async (forum) => {
        if (memoizedAdminUsers[forum.adminUserId]) {
          forum.author = {
            id: memoizedAdminUsers[forum.adminUserId].id,
            name: memoizedAdminUsers[forum.adminUserId].name,
            username: memoizedAdminUsers[forum.adminUserId].username,
            avatar: memoizedAdminUsers[forum.adminUserId].avatar,
          };
        } else if (memoizedAppUsers[forum.userId]) {
          forum.author = {
            id: memoizedAppUsers[forum.userId].id,
            name: memoizedAppUsers[forum.userId].name,
            username: memoizedAppUsers[forum.userId].username,
            avatar: memoizedAppUsers[forum.userId].avatar,
          };
        } else forum.author = null;

        const commentCount = await this.forumRepo.getCommentCount(
          forum.uniqueId,
        );
        forum.commentCount = commentCount;
        return forum;
      }),
    );

    return updatedFeaturedForums;
  }
}
