import { PostContent, PostContentMention } from './post-content.view-model';
import { isObject } from 'st-utils';

export function getMentionsFromPostContent(content: PostContent): PostContentMention[] {
  const mentions: PostContentMention[] = [];
  for (const op of content.ops) {
    if (isObject(op.insert) && op.insert.mention) {
      mentions.push(op.insert.mention);
    }
  }
  return mentions;
}

export function getMentionIdsAsSetFromPostContent(content: PostContent): Set<string> {
  const set = new Set<string>();
  for (const op of content.ops) {
    if (isObject(op.insert) && op.insert.mention && !set.has(op.insert.mention.id)) {
      set.add(op.insert.mention.id);
    }
  }
  return set;
}
