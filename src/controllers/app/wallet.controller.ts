import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { SCTransactionHistoryService } from '../../services/sc-transaction-history.services';
import { SCTransactionHistoryModel } from '../../db/rdb/models';
import { EducationalContentService } from '../../services/edu-content.services.';
import { MemoizedEduContentType } from '../../types/edu-content.types';
import { formatSCTransactionHistory } from '../../formatter/sc-transaction-history.formatter';
import { SCTransactionResponseType } from '../../types/sc-transaction-history.type';
import { AppUserBalanceService } from '../../services/app-user-balance.services';
import { AuctionBatchService } from '../../services/auction-batch.services.';
import {
  MemoizedAuctionBatchesType,
  MemoizedAuctionType,
} from '../../types/auction-batch.type';
import { AuctionService } from '../../services/auction.services.';
import { TAuctionBatchWallet, TAuctionWallet } from '../../types/wallet.type';
import mongoose from 'mongoose';
import { BadRequestException } from '../../errors/BadRequestException.error';

const userBalanceService = new AppUserBalanceService();
const scTransactionHistoryService = new SCTransactionHistoryService();
const educationalContentService = new EducationalContentService();
const auctionService = new AuctionService();
const auctionBatchService = new AuctionBatchService();

export async function getUserWalletInfScroll(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const userBalance = await userBalanceService.findAppUserBalanceByUserId(
      req.user!.id,
      ['coin_balance', 'exp_date'],
    );

    const oldestSCTransId = req.body.oldest_sc_trans_id
      ? req.body.oldest_sc_trans_id !== ''
        ? req.body.oldest_sc_trans_id
        : null
      : null;
    const limit = req.body.limit ? Number(req.body.limit) : 10;
    const scTransactionHistoriesData =
      await scTransactionHistoryService.getUserSCTransactionHistoryInfScroll(
        req.user!.id,
        oldestSCTransId,
        limit,
      );

    let eduContentToFetch: string[] = [];
    scTransactionHistoriesData[1].map((item: SCTransactionHistoryModel) => {
      if (item.edu_content_id)
        eduContentToFetch = [...eduContentToFetch, item.edu_content_id];
    });

    let memoizedEduContents = {} as unknown as MemoizedEduContentType;
    let eduContents = [];
    if (eduContentToFetch.length > 0) {
      eduContentToFetch = [...new Set(eduContentToFetch)] as string[];
      eduContents =
        await educationalContentService.getEducationalContentByUniqueIds(
          eduContentToFetch,
          false,
          '_id uniqueId category title price is_premium createdAt',
        );

      eduContents.map((item: any) => {
        memoizedEduContents = { ...memoizedEduContents, [item.uniqueId]: item };
      });
    }

    let auctionsToFetchUniqueIds: string[] = [];
    scTransactionHistoriesData[1].map((item: SCTransactionHistoryModel) => {
      if (item.auction_id)
        auctionsToFetchUniqueIds = [
          ...auctionsToFetchUniqueIds,
          item.auction_id,
        ];
    });

    let auctions: TAuctionWallet[] = [];
    let memoizedAuctions = {} as unknown as MemoizedAuctionType;
    let auctionBatches: TAuctionBatchWallet[] = [];
    let memoizedAuctionBatches = {} as unknown as MemoizedAuctionBatchesType;
    let auctionIds: mongoose.Types.ObjectId[] = [];
    if (auctionsToFetchUniqueIds.length > 0) {
      auctionsToFetchUniqueIds = [
        ...new Set(auctionsToFetchUniqueIds),
      ] as string[];

      auctions = (await auctionService.getAuctionsByUniqueIds(
        auctionsToFetchUniqueIds,
        '_id uniqueId title address entry_coins createdAt',
      )) as unknown as TAuctionWallet[];
      auctions.map((item: any) => {
        memoizedAuctions = { ...memoizedAuctions, [item.uniqueId]: item };
        auctionIds = [...auctionIds, item._id];
      });

      auctionBatches =
        (await auctionBatchService.getUserAuctionBatchesByAuctionIds(
          req.user!.id,
          auctionIds,
          '_id uniqueId user_id auction createdAt',
        )) as unknown as TAuctionBatchWallet[];
      auctionBatches.map((item: any) => {
        memoizedAuctionBatches = {
          ...memoizedAuctionBatches,
          [item.auction]: item,
        };
      });

      for (const [key, value] of Object.entries(memoizedAuctions)) {
        memoizedAuctions[key].createdAt =
        memoizedAuctionBatches[value._id] ? memoizedAuctionBatches[value._id].createdAt : memoizedAuctions[key].createdAt;
      }
    }

    const formattedTransactions = formatSCTransactionHistory(
      scTransactionHistoriesData[1] as unknown as SCTransactionResponseType[],
      memoizedEduContents,
      memoizedAuctions,
    );

    return res.json({
      data: {
        coin_balance: userBalance.coin_balance,
        expires_at: userBalance.exp_date,
        next:
          Number(scTransactionHistoriesData[0]) > 0
            ? scTransactionHistoriesData[0]
            : 0,
        sc_transactions: formattedTransactions,
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function getUserWalletInfScrollDesktop(
  req: AppAuthenticatedRequest & {query: { oldest_sc_trans_id: string|null|undefined; limit: string|null|undefined; }},
  res: Response,
) {
  try {
    const userBalance = await userBalanceService.findAppUserBalanceByUserId(
      req.user!.id,
      ['coin_balance', 'exp_date'],
    );

    if(typeof req.query.oldest_sc_trans_id !== 'string' && req.query.oldest_sc_trans_id !== null && req.query.oldest_sc_trans_id !== undefined)
      throw new BadRequestException('Oldest sweep coin transaction id has to be a string or null.')
    if(typeof req.query.limit !== 'string' && req.query.limit !== null && req.query.limit !== undefined)
      throw new BadRequestException('Limit has to be a string or null.')

    const oldestSCTransId = req.query.oldest_sc_trans_id
      ? req.query.oldest_sc_trans_id.length > 0
        ? req.query.oldest_sc_trans_id
        : null
      : null;

    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const scTransactionHistoriesData =
      await scTransactionHistoryService.getUserSCTransactionHistoryInfScroll(
        req.user!.id,
        oldestSCTransId,
        limit,
      );

    let eduContentToFetch: string[] = [];
    scTransactionHistoriesData[1].map((item: SCTransactionHistoryModel) => {
      if (item.edu_content_id)
        eduContentToFetch = [...eduContentToFetch, item.edu_content_id];
    });

    let memoizedEduContents = {} as unknown as MemoizedEduContentType;
    let eduContents = [];
    if (eduContentToFetch.length > 0) {
      eduContentToFetch = [...new Set(eduContentToFetch)] as string[];
      eduContents =
        await educationalContentService.getEducationalContentByUniqueIds(
          eduContentToFetch,
          false,
          '_id uniqueId category title price is_premium createdAt',
        );

      eduContents.map((item: any) => {
        memoizedEduContents = { ...memoizedEduContents, [item.uniqueId]: item };
      });
    }

    let auctionsToFetchUniqueIds: string[] = [];
    scTransactionHistoriesData[1].map((item: SCTransactionHistoryModel) => {
      if (item.auction_id)
        auctionsToFetchUniqueIds = [
          ...auctionsToFetchUniqueIds,
          item.auction_id,
        ];
    });

    let auctions: TAuctionWallet[] = [];
    let memoizedAuctions = {} as unknown as MemoizedAuctionType;
    let auctionBatches: TAuctionBatchWallet[] = [];
    let memoizedAuctionBatches = {} as unknown as MemoizedAuctionBatchesType;
    let auctionIds: mongoose.Types.ObjectId[] = [];
    if (auctionsToFetchUniqueIds.length > 0) {
      auctionsToFetchUniqueIds = [
        ...new Set(auctionsToFetchUniqueIds),
      ] as string[];

      auctions = (await auctionService.getAuctionsByUniqueIds(
        auctionsToFetchUniqueIds,
        '_id uniqueId title address entry_coins createdAt',
      )) as unknown as TAuctionWallet[];
      auctions.map((item: any) => {
        memoizedAuctions = { ...memoizedAuctions, [item.uniqueId]: item };
        auctionIds = [...auctionIds, item._id];
      });

      auctionBatches =
        (await auctionBatchService.getUserAuctionBatchesByAuctionIds(
          req.user!.id,
          auctionIds,
          '_id uniqueId user_id auction createdAt',
        )) as unknown as TAuctionBatchWallet[];
      auctionBatches.map((item: any) => {
        memoizedAuctionBatches = {
          ...memoizedAuctionBatches,
          [item.auction]: item,
        };
      });

      for (const [key, value] of Object.entries(memoizedAuctions)) {
        memoizedAuctions[key].createdAt =
          memoizedAuctionBatches[value._id] ? memoizedAuctionBatches[value._id].createdAt : memoizedAuctions[key].createdAt;
      }
    }

    const formattedTransactions = formatSCTransactionHistory(
      scTransactionHistoriesData[1] as unknown as SCTransactionResponseType[],
      memoizedEduContents,
      memoizedAuctions,
    );

    return res.json({
      data: {
        coin_balance: userBalance.coin_balance,
        expires_at: userBalance.exp_date,
        next:
          Number(scTransactionHistoriesData[0]) > 0
            ? scTransactionHistoriesData[0]
            : 0,
        sc_transactions: formattedTransactions,
      },
      statusCode: 200,
    });
  } catch (e) {
    // console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}