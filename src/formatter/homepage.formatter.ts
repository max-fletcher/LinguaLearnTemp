import { EduContentCategories } from '../constants/enums';
import {
  THomepageAuctionBeforeFormatting,
  THomepageAuctionFormatted,
} from '../types/auction.type';
import {
  THomepageBlogBeforeFormatting,
  THomepageBlogFormatted,
} from '../types/blog.types';
import { Currency } from '../types/currency.type';
import { TEduContentPurchase } from '../types/edu-content-purchase.types';
import {
  THomepageEducationalContentBeforeFormatting,
  THomepageEducationalContentFormatted,
} from '../types/edu-content.types';
import {
  THomepageForumBeforeFormatting,
  THomepageForumFormatted,
} from '../types/forum.types';

export function formatHomepageData(
  featuredAuctions: THomepageAuctionBeforeFormatting[],
  premiumEduContent: THomepageEducationalContentBeforeFormatting[],
  upcomingAuctions: THomepageAuctionBeforeFormatting[],
  eduContent: THomepageEducationalContentBeforeFormatting[],
  blogs: THomepageBlogBeforeFormatting[],
  forums: THomepageForumBeforeFormatting[],
  currency: Currency,
  unseenNotificationsCount: number|null,
  appUserId: string|undefined,
  highestOrder: number|null = null,
  premiumPurchased: TEduContentPurchase[],
): {
  featuredAuctions: THomepageAuctionFormatted[];
  premiumEduContent: THomepageEducationalContentFormatted[];
  upcomingAuctions: THomepageAuctionFormatted[];
  eduContent: THomepageEducationalContentFormatted[];
  blogs: THomepageBlogFormatted[];
  forums: THomepageForumFormatted[];
  unseenNotificationsCount: number|null
} {
  const formattedHomepageFeaturedAuctions = featuredAuctions.map((auction) => {
    const latestbatchUniqueId = auction.batches.reduce((a, b)=>a.batch_no > b.batch_no ? a:b ).uniqueId
    return {
      id: auction._id,
      uniqueId: auction.uniqueId!,
      batchUniqueId: latestbatchUniqueId,
      currency: {
        id: currency.id,
        name: currency.name,
        short_code: currency.short_code,
      },
      title: auction.title!,
      address: auction.address!,
      entry_coins: auction.entry_coins!,
      jackpot: auction.jackpot!,
      starting_bid: auction.starting_bid!,
      image_url: auction.image_url ? auction.image_url : null,
      game_start_datetime: auction.game_start_datetime,
      game_end_datetime: auction.game_end_datetime
    };
  });

  const formattedHomepagePremiumEduContent = premiumEduContent.map(
    (premiumEduContent) => {
      let puchased = null
      if(appUserId)
        puchased = premiumPurchased.find((prePur: any) => {
          return (prePur.edu_content_id.toString() === premiumEduContent._id!.toString() && prePur.user_id === appUserId)
        })

      return {
        id: premiumEduContent._id,
        uniqueId: premiumEduContent.uniqueId!,
        category: premiumEduContent.category,
        content_type: premiumEduContent.content_type,
        access_level: premiumEduContent.access_level,
        thumbnail_url: premiumEduContent.thumbnail_url
          ? premiumEduContent.thumbnail_url
          : null,
        title: premiumEduContent.title,
        currency: {
          id: currency.id,
          name: currency.name,
          short_code: currency.short_code,
        },
        price: premiumEduContent.price,
        coins_rewarded: premiumEduContent.coins_rewarded,
        duration: premiumEduContent.duration,
        purchased: puchased ? true : false,
        tier_access: false,
      };
    },
  );

  const formattedHomepageUpcomingAuctions = upcomingAuctions.map(
    (upcomingAuction) => {
      const latestbatchUniqueId = upcomingAuction.batches.reduce((a, b)=>a.batch_no > b.batch_no ? a:b ).uniqueId
      return {
        id: upcomingAuction._id,
        uniqueId: upcomingAuction.uniqueId!,
        batchUniqueId: latestbatchUniqueId,
        currency: {
          id: currency.id,
          name: currency.name,
          short_code: currency.short_code,
        },
        title: upcomingAuction.title!,
        address: upcomingAuction.address!,
        entry_coins: upcomingAuction.entry_coins!,
        jackpot: upcomingAuction.jackpot!,
        starting_bid: upcomingAuction.starting_bid!,
        image_url: upcomingAuction.image_url ? upcomingAuction.image_url : null,
        game_start_datetime: upcomingAuction.game_start_datetime,
        game_end_datetime: upcomingAuction.game_end_datetime
      };
    },
  );

  const formattedHomepageEduContent = eduContent.map((eduContent) => {
    return {
      id: eduContent._id,
      uniqueId: eduContent.uniqueId!,
      category: eduContent.category,
      content_type: eduContent.content_type,
      access_level: eduContent.access_level,
      thumbnail_url: eduContent.thumbnail_url ? eduContent.thumbnail_url : null,
      title: eduContent.title,
      price: eduContent.price,
      coins_rewarded: eduContent.coins_rewarded,
      duration: eduContent.duration,
      is_library: eduContent.tier_order === 3 ? true : false,
      is_vault: eduContent.tier_order === 4 ? true : false,
      purchased: false,
      tier_access: eduContent.category === EduContentCategories.NONPREMIUM && highestOrder && highestOrder >= eduContent.tier_order! ? true : false,
    };
  });

  const formattedHomepageBlogs = blogs.map((blog) => {
    return {
      id: blog._id,
      uniqueId: blog.uniqueId!,
      title: blog.title,
      thumbnail_image: blog.thumbnail_image,
      read_duration: blog.read_duration,
      createdAt: blog.createdAt,
    };
  });

  const formattedHomepageForums = forums.map((forum) => {
    return {
      id: forum._id,
      uniqueId: forum.uniqueId!,
      title: forum.title,
      commentCount: forum.commentCount,
      author: forum.author,
      createdAt: forum.createdAt,
    };
  });

  return {
    featuredAuctions: formattedHomepageFeaturedAuctions,
    premiumEduContent: formattedHomepagePremiumEduContent,
    upcomingAuctions: formattedHomepageUpcomingAuctions,
    eduContent: formattedHomepageEduContent,
    blogs: formattedHomepageBlogs,
    forums: formattedHomepageForums,
    unseenNotificationsCount: unseenNotificationsCount
  };
}
