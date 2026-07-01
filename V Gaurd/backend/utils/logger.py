import io
import logging
import sys


def setup_logger(name: str = "vguard") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        # Force UTF-8 on Windows — cp1252 default breaks when logging Tamil/
        # Malayalam/Hindi Unicode text returned by the LLM or STT services.
        if hasattr(sys.stdout, "reconfigure"):
            try:
                sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            except Exception:
                pass
        stream = io.TextIOWrapper(
            sys.stdout.buffer if hasattr(sys.stdout, "buffer") else sys.stdout,
            encoding="utf-8",
            errors="replace",
            line_buffering=True,
        ) if hasattr(sys.stdout, "buffer") else sys.stdout

        handler = logging.StreamHandler(stream)
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


logger = setup_logger()
