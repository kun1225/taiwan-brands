import { describe, expect, it } from "vitest";

import {
  extractRawBrandRecordsFromThreadComments,
  type ThreadsCommentsPayload,
} from "./threads-comments";

const payload: ThreadsCommentsPayload = {
  generatedAt: "2026-05-04T00:00:00.000Z",
  posts: [
    {
      shortcode: "DHckBsthazV",
      postId: "2",
      url: "https://www.threads.com/t/DHckBsthazV",
      text: "有台灣製好穿的運動服飾可以推薦嗎？",
      username: "branch_0218",
      replyCount: 52,
    },
  ],
  comments: [
    {
      sourceShortcode: "DL9QBn6B8ux",
      sourcePostId: "1",
      sourcePostUrl: "https://www.threads.com/t/DL9QBn6B8ux",
      commentId: "comment-1",
      parentCommentId: "",
      username: "changetone",
      fullName: "",
      text: "您好～我們想要自薦！ 我們是 ChangeTone 襪子專賣店，堅持台灣設計・台灣製造，也歡迎來我們網站逛逛 https://www.changetone.com/",
      createdAt: "1",
      likeCount: 10,
      replyCount: null,
      depth: null,
    },
    {
      sourceShortcode: "DL9QBn6B8ux",
      sourcePostId: "1",
      sourcePostUrl: "https://www.threads.com/t/DL9QBn6B8ux",
      commentId: "comment-2",
      parentCommentId: "",
      username: "susanshin.ch",
      fullName: "",
      text: "https://www.threads.com/@playzuhome?igshid=NTc4MTIwNjQ2YQ== 先貼一個",
      createdAt: "2",
      likeCount: 2,
      replyCount: null,
      depth: null,
    },
    {
      sourceShortcode: "DL9QBn6B8ux",
      sourcePostId: "1",
      sourcePostUrl: "https://www.threads.com/t/DL9QBn6B8ux",
      commentId: "comment-3",
      parentCommentId: "",
      username: "anonymous",
      fullName: "",
      text: "這主題很讚，卡一個",
      createdAt: "3",
      likeCount: 0,
      replyCount: null,
      depth: null,
    },
    {
      sourceShortcode: "DL9QBn6B8ux",
      sourcePostId: "1",
      sourcePostUrl: "https://www.threads.com/t/DL9QBn6B8ux",
      commentId: "comment-4",
      parentCommentId: "",
      username: "bubble_nara",
      fullName: "",
      text: "我我我~ 我們是來自台南的手工鞋品牌~波波娜拉 Bubble Nara 鞋子都是台灣在地製造~ https://www.bubble-nara.com/",
      createdAt: "4",
      likeCount: 5,
      replyCount: null,
      depth: null,
    },
    {
      sourceShortcode: "DHckBsthazV",
      sourcePostId: "2",
      sourcePostUrl: "https://www.threads.com/t/DHckBsthazV",
      commentId: "comment-5",
      parentCommentId: "",
      username: "ume_plan",
      fullName: "",
      text: "推薦我們家 @ume_plan",
      createdAt: "5",
      likeCount: 0,
      replyCount: null,
      depth: null,
    },
  ],
};

describe("extractRawBrandRecordsFromThreadComments", () => {
  it("extracts self-introduced brands with website URLs", () => {
    const result = extractRawBrandRecordsFromThreadComments(payload);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "ChangeTone",
          officialUrl: "https://www.changetone.com/",
          officialUrlType: "website",
          description: "服飾",
          sourceName: "threads-comments",
          sourceUrl: "https://www.threads.com/t/DL9QBn6B8ux",
        }),
      ]),
    );
  });

  it("extracts threads profile recommendations as medium-confidence candidates", () => {
    const result = extractRawBrandRecordsFromThreadComments(payload);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "playzuhome",
          officialUrl: "https://www.threads.com/@playzuhome",
          officialUrlType: "threads",
          sourceName: "threads-comments",
        }),
      ]),
    );
  });

  it("extracts plain mention recommendations as threads profile URLs", () => {
    const result = extractRawBrandRecordsFromThreadComments(payload);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "ume_plan",
          description: "服飾、戶外運動用品",
          officialUrl: "https://www.threads.com/@ume_plan",
          officialUrlType: "threads",
          sourceName: "threads-comments",
          sourceUrl: "https://www.threads.com/t/DHckBsthazV",
        }),
      ]),
    );
  });

  it("falls back to the official URL when extracted text is too generic", () => {
    const result = extractRawBrandRecordsFromThreadComments(payload);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "bubble-nara",
          officialUrl: "https://www.bubble-nara.com/",
          officialUrlType: "website",
        }),
      ]),
    );
  });

  it("ignores comments without brand signals", () => {
    const result = extractRawBrandRecordsFromThreadComments(payload);

    expect(result).toHaveLength(4);
  });
});
