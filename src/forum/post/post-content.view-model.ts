import { Property } from '../../mapper/property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class PostContentMention {
  @Property() index!: string;
  @Property() denotationChar!: string;
  @Property() id!: string;
  @Property() value!: string;
  @Property() link!: string;
}

export class PostContentInsert {
  @Property() video?: string;
  @Property(() => PostContentMention) mention?: PostContentMention;
}

export class PostContentAttributes {
  @Property() bold?: boolean;
  @Property() italic?: boolean;
  @Property() underline?: boolean;
  @Property() strike?: boolean;
  @Property() blockquote?: boolean;
  @Property() 'code-block'?: boolean;
  @Property() list?: string;
  @Property() indent?: number;
  @Property() align?: string;
  @Property() direction?: string;
  @Property() size?: string;
  @Property() header?: number;
  @Property() color?: string;
  @Property() background?: string;
  @Property() font?: string;
  @Property() link?: string;
}

export class PostContentOp {
  @Property()
  @ApiProperty({ type: PostContentInsert, description: 'String is also valid for this model' })
  insert!: PostContentInsert | string;

  @Property(() => PostContentAttributes) attributes?: PostContentAttributes;
}

export class PostContent {
  @Property(() => PostContentOp) ops!: PostContentOp[];
}
