import {
  TEduContentPurchasedType,
  TFormattedEduContentType,
} from '../types/edu-content-purchase.types';

export function formatPurchasedEduContent(
  data: TEduContentPurchasedType[],
): TFormattedEduContentType[] {
  const formattedData: TFormattedEduContentType[] = data.map(
    (purchasedEduContent: TEduContentPurchasedType) => {
      return {
        id: purchasedEduContent.edu_content_id._id,
        uniqueId: purchasedEduContent.uniqueId,
        admin_user_id: purchasedEduContent.edu_content_id.admin_user_id,
        is_library: purchasedEduContent.edu_content_id.is_library,
        is_vault: purchasedEduContent.edu_content_id.is_vault,
        content_type: purchasedEduContent.edu_content_id.content_type,
        thumbnail_url: purchasedEduContent.edu_content_id.thumbnail_url,
        title: purchasedEduContent.edu_content_id.title,
        currency_id: purchasedEduContent.edu_content_id.currency_id,
        price: purchasedEduContent.edu_content_id.price,
        coins_rewarded: purchasedEduContent.edu_content_id.coins_rewarded,
        duration: purchasedEduContent.edu_content_id.duration,
        createdAt: purchasedEduContent.edu_content_id.createdAt,
      };
    },
  );

  return formattedData;
}
