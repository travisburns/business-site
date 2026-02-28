namespace Pipeline.Enums
{
    public enum LeadStatus
    {
        New = 0,
        Contacted = 1,
        Qualified = 2,
        Proposal = 3,
        Won = 4,
        Lost = 5
    }

    public enum LeadTier
    {
        Micro = 0,
        Starting = 1,
        Low = 2,
        Mid = 3,
        High = 4,
        Enterprise = 5,
        Corporate = 6
    }

    public enum LeadSource
    {
        YellowPages = 0,
        GoogleMaps = 1,
        Manual = 2,
        CsvImport = 3,
        Referral = 4
    }

    public enum ScrapingStatus
    {
        Pending = 0,
        Running = 1,
        Completed = 2,
        Failed = 3,
        Cancelled = 4
    }
}
