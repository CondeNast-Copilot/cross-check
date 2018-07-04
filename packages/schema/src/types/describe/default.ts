import { LabelledType, NamedType, Type } from "../fundamental/value";
import { GenericLabel, PrimitiveLabel, RecordLabel } from "./label";
import { Position, ReporterState } from "./reporter";

export class RecordReporter<Buffer, Inner, Options> extends ReporterState<
  Buffer,
  Inner,
  Options
> {
  startDictionaryBody(): void {
    /* noop */
  }

  startDictionary(position: Position): void {
    this.state.nesting += 1;

    this.pushStrings(
      this.reporters.openDictionary({
        position,
        ...this.state
      })
    );
  }

  endDictionary(position: Position, { isRequired }: Type): void {
    this.state.nesting -= 1;

    this.pushStrings(
      this.reporters.closeDictionary({
        position,
        required: isRequired,
        ...this.state
      })
    );
  }

  startRecord(_position: Position, type: LabelledType<RecordLabel>): void {
    this.state.nesting += 1;

    this.pushStrings(
      this.reporters.openRecord({
        type,
        ...this.state
      })
    );
  }

  endRecord(_position: Position, type: LabelledType<RecordLabel>): void {
    this.pushStrings(
      this.reporters.closeRecord({
        type,
        ...this.state
      })
    );
  }

  addKey(key: string, position: Position, required: boolean): void {
    this.pushStrings(
      this.reporters.emitKey({
        key,
        position,
        required,
        ...this.state
      })
    );
  }

  endValue(position: Position, { isRequired }: Type): void {
    this.pushStrings(
      this.reporters.closeValue({
        position,
        required: isRequired,
        ...this.state
      })
    );
  }

  endGenericValue(position: Position, type: LabelledType<GenericLabel>): void {
    this.pushStrings(
      this.reporters.closeGeneric({
        position,
        type,
        ...this.state
      })
    );
  }

  startGenericValue(
    position: Position,
    type: LabelledType<GenericLabel>
  ): void {
    this.pushStrings(
      this.reporters.openGeneric({
        position,
        type,
        ...this.state
      })
    );
  }

  primitiveValue(position: Position, type: LabelledType<PrimitiveLabel>): void {
    this.pushStrings(
      this.reporters.emitPrimitive({
        type,
        position,
        ...this.state
      })
    );
  }

  namedValue(_position: Position, type: NamedType): void {
    this.pushStrings(
      this.reporters.emitNamedType({
        type,
        ...this.state
      })
    );
  }
}
