---
name: pi-pods
description: @mariozechner/pi — Deploy and manage vLLM LLM GPU pods, DataCrunch/RunPod setup, and CLI agent interface. Use when spinning up GPU instances, configuring vLLM, managing tensor parallelism, or interacting with models via pi agent. Use for "pi pods setup", "vLLM memory", "Qwen GLM models pi", even without naming the pods package.
compatibility: CLI usage of pi; read pi-mono/packages/pods/README.md for commands and vLLM configuration.
---

# Pi Pods

## Grounding

1. `pi-mono/packages/pods/README.md` — installation, pod management, model commands, GPU multi-assignment, and pre-defined models.
2. `pi-mono/packages/pods/src/` — CLI commands implementation if needing deeper args validation.

## Invariants

- **Auto-assignment**: When running multiple models on the same pod, `pi` automatically assigns them to different GPUs.
- **Parameter Ignorance**: When passing custom vLLM args with `--vllm`, the default CLI shortcuts for `--memory`, `--context`, and `--gpus` are ignored.

## Workflows

- **Setup Pod**: Use `pi pods setup <name> "<ssh>"` along with `--mount` for shared NFS storage (DataCrunch) or network volumes (RunPod).
- **Start Pre-defined Model**: Use `pi start <model> --name <name>` for known agentic models (Qwen, GLM, GPT-OSS). The tool calling parsers are automatically configured.
- **Custom vLLM Args**: Pass specific settings (e.g. tensor parallelism) using `--vllm --tensor-parallel-size <N>`.

## Anti-patterns

- Do not manually construct tool-calling parsers for pre-defined models like Qwen or GLM; `pi` configures `hermes` or `glm4_moe` automatically.
- Do not assume models are downloaded redundantly on DataCrunch; emphasize the NFS shared models path (`/mnt/hf-models`).
