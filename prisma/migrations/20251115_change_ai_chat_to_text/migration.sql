-- AlterTable: Change ai_chat_history columns from UUID to TEXT
ALTER TABLE "ai_chat_history" 
  ALTER COLUMN "id" TYPE TEXT USING "id"::TEXT,
  ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT,
  ALTER COLUMN "session_id" TYPE TEXT USING "session_id"::TEXT;

-- Drop the default UUID generation since we'll use application-generated IDs
ALTER TABLE "ai_chat_history" ALTER COLUMN "id" DROP DEFAULT;
