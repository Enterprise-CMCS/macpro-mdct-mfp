/**
 * Exposes the constants used throughout the program.
 *
 * The following variables have to be set:
 *
 * CLAMAV_BUCKET_NAME: Name of the bucket where ClamAV and its definitions are stored
 * PATH_TO_AV_DEFINITIONS: Path in S3 where the definitions are stored.
 *
 * The following variables can be overridden:
 *
 * STATUS_CLEAN_FILE: (default 'CLEAN') Tag that will be added to files that are clean.
 * STATUS_INFECTED_FILE: (default 'INFECTED') Tag that will be added to files that are infected.
 * STATUS_ERROR_PROCESSING_FILE: (default 'ERROR') Tag that will be added to files where the scan was not successful.
 * VIRUS_SCAN_STATUS_KEY: (default 'virusScanStatus') Name of the tag that indicates the status of the virus scan.
 * VIRUS_SCAN_TIMESTAMP_KEY: (default 'virusScanTimestamp') Name of the tag that indicates the time of the virus scan.
 */

// Various paths and application names on S3
const CLAMAV_BUCKET_NAME = process.env.CLAMAV_BUCKET_NAME;
const PATH_TO_AV_DEFINITIONS = process.env.PATH_TO_AV_DEFINITIONS;
const PATH_TO_FRESHCLAM = "/opt/bin/freshclam";
const PATH_TO_CLAMAV = "/opt/bin/clamscan";
const FRESHCLAM_CONFIG = "/opt/bin/freshclam.conf";
const FRESHCLAM_WORK_DIR = "/tmp/";
const DOWNLOAD_DIR = "/tmp/download";

// Constants for tagging file after a virus scan.
const STATUS_CLEAN_FILE = process.env.STATUS_CLEAN_FILE || "CLEAN";
const STATUS_INFECTED_FILE = process.env.STATUS_INFECTED_FILE || "INFECTED";
const STATUS_ERROR_PROCESSING_FILE =
  process.env.STATUS_ERROR_PROCESSING_FILE || "ERROR";
const STATUS_SKIPPED_FILE = process.env.STATUS_SKIPPED_FILE || "SKIPPED";
const VIRUS_SCAN_STATUS_KEY =
  process.env.VIRUS_SCAN_STATUS_KEY || "virusScanStatus";
const VIRUS_SCAN_TIMESTAMP_KEY =
  process.env.VIRUS_SCAN_TIMESTAMP_KEY || "virusScanTimestamp";
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || "314572800";

// List of CLAMAV definition files. These are the compressed files.

module.exports = {
  CLAMAV_BUCKET_NAME: CLAMAV_BUCKET_NAME,
  PATH_TO_AV_DEFINITIONS: PATH_TO_AV_DEFINITIONS,
  PATH_TO_FRESHCLAM: PATH_TO_FRESHCLAM,
  PATH_TO_CLAMAV: PATH_TO_CLAMAV,
  FRESHCLAM_CONFIG: FRESHCLAM_CONFIG,
  FRESHCLAM_WORK_DIR: FRESHCLAM_WORK_DIR,
  DOWNLOAD_DIR: DOWNLOAD_DIR,
  STATUS_CLEAN_FILE: STATUS_CLEAN_FILE,
  STATUS_INFECTED_FILE: STATUS_INFECTED_FILE,
  STATUS_ERROR_PROCESSING_FILE: STATUS_ERROR_PROCESSING_FILE,
  STATUS_SKIPPED_FILE: STATUS_SKIPPED_FILE,
  VIRUS_STATUS_STATUS_KEY: VIRUS_SCAN_STATUS_KEY,
  VIRUS_SCAN_TIMESTAMP_KEY: VIRUS_SCAN_TIMESTAMP_KEY,
  MAX_FILE_SIZE: MAX_FILE_SIZE,
};
