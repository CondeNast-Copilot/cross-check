import { JSONObject, Option } from "ts-std";
import { builders, dehydrated, resolved } from "../../descriptors";
import { RecordBuilder } from "../../record";
import { ReferenceImpl } from "./reference";

export class PointerImpl extends ReferenceImpl {
  readonly descriptor!: resolved.Pointer;

  dehydrate(): dehydrated.Pointer {
    return {
      type: "Pointer",
      kind: this.kind,
      metadata: this.metadata,
      inner: {
        type: "Record",
        name: this.name,
        required: true
      },
      required: true
    };
  }
}

export function hasOne(
  item: RecordBuilder,
  options: Option<JSONObject> = null
): builders.PointerBuilder {
  return new builders.PointerBuilder({
    kind: "hasOne",
    metadata: options,
    record: item
  });
}
