# 2. Bundle the official ASVS data unchanged

Status: accepted

## Decision

Bundle the official ASVS 5.0.0 JSON from the `v5.0.0_release` tag in `data/asvs/`, with a checksum and a license notice. Our code stays MIT; ASVS content stays CC BY-SA 4.0. Categories live in separate mapping files and never modify the official data. Exports carry attribution and the CC BY-SA 4.0 notice. Exports containing ASVS text are shared under CC BY-SA 4.0.

## Consequences

The licenses are cleanly separated. Tests can verify the data against the checksum and known counts. Adding another ASVS version means adding another pinned data folder.
