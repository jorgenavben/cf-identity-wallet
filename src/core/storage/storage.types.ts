import { instanceToPlain } from "class-transformer";
import { BasicRecord } from "../agent/records";

type Tags = Record<string | number, unknown>;
abstract class BaseRecord {
  protected _tags: Tags = {} as Tags;

  id!: string;

  createdAt!: Date;

  updatedAt?: Date;

  abstract getTags(): Tags;

  setTag(name: keyof Tags, value: Tags[keyof Tags]) {
    this._tags[name] = value;
  }

  getTag(name: keyof Tags | keyof Tags) {
    return this.getTags()[name];
  }

  setTags(tags: Partial<Tags>) {
    this._tags = {
      ...this._tags,
      ...tags,
    };
  }

  replaceTags(tags: Tags & Partial<Tags>) {
    this._tags = tags;
  }

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this, {
      exposeDefaultValues: true,
    });
  }
}

interface SaveBasicRecordOption {
  content: Record<string, unknown>;
  id?: string;
  tags?: Tags;
  type: RecordType;
}

enum RecordType {
  CONNECTION_NOTE = "ConnectionNote",
  CONNECTION_KERI_METADATA = "ConnectionKeriMetadata",
  NOTIFICATION_KERI = "NotificationKeri",
  CREDENTIAL_METADATA_RECORD = "CredentialMetadataRecord",
  IDENTIFIER_METADATA_RECORD = "IdentifierMetadataRecord",
  OP_PASS_HINT = "OpPassHint",
}

type SimpleQuery<T extends BaseRecord> = Partial<ReturnType<T["getTags"]>> &
  Tags;
interface AdvancedQuery<T extends BaseRecord> {
  $and?: Query<T>[];
  $or?: Query<T>[];
  $not?: Query<T>;
}
type Query<T extends BaseRecord> = AdvancedQuery<T> | SimpleQuery<T>;

interface StorageApi {
  open(storageName: string): Promise<void>;
  save({ content, tags, id }: SaveBasicRecordOption): Promise<BasicRecord>;
  delete(record: BasicRecord): Promise<void>;
  deleteById(id: string): Promise<void>;
  update(record: BasicRecord): Promise<void>;
  findById(id: string): Promise<BasicRecord | null>;
  findAllByQuery(
    type: RecordType,
    query: Query<BasicRecord>
  ): Promise<BasicRecord[]>;
  getAll(type: RecordType): Promise<BasicRecord[]>;
}
interface StorageRecord {
  name: string;
  value: string;
  tags: Record<string, unknown>;
  category: string;
}

export { BaseRecord, RecordType };
export type { StorageApi, Query, SaveBasicRecordOption, StorageRecord, Tags };