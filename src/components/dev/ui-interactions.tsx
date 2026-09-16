"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function UiInteractions() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitNote, setSubmitNote] = useState("");

  function onDemoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitNote("Submit event received. Nothing was sent or saved.");
  }

  return (
    <div className="flex flex-col gap-4">
      <p aria-live="polite">
        Example counter: <strong>{count}</strong>
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setCount((value) => value + 1)}>
          Increment example
        </Button>
        <Button
          variant="secondary"
          loading={loading}
          onClick={() => setLoading(true)}
        >
          Start loading example
        </Button>
        <Button
          variant="quiet"
          disabled
          onClick={() => setCount((value) => value + 100)}
        >
          Disabled example
        </Button>
      </div>
      <form className="flex flex-wrap items-end gap-3" onSubmit={onDemoSubmit}>
        <Button>Default in a form (does not submit)</Button>
        <Button type="submit" variant="secondary">
          Submit example
        </Button>
      </form>
      {submitNote ? (
        <p className="ds-support" aria-live="polite">
          {submitNote}
        </p>
      ) : null}
    </div>
  );
}
