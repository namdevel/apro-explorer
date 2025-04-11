// ~/lib/api/aiAgent.ts
export const fetchAiAgentOverview = async () => {
    try {
        const timestamp = Date.now();
        const response = await fetch(`https://attps-test.apro.com/api/ai-agent/overview?ts=${timestamp}`);
        const json = await response.json();

        if (json.code === 0) {
            return json.result;
        } else {
            throw new Error(json.message || 'Unknown error');
        }
    } catch (error) {
        throw error;
    }
};

export const fetchLatestMessages = async (page = 1, size = 10) => {
    const ts = Date.now();
    const res = await fetch(
        `https://attps-test.apro.com/api/ai-agent/data-message?page=${page}&pageSize=${size}&ts=${ts}`
    );
    const json = await res.json();
    return json.result.content;
};

export const fetchLatestSourceAgent = async (page = 1, size = 10) => {
    const ts = Date.now();
    const res = await fetch(
        `https://attps-test.apro.com/api/ai-agent/source-agent?page=${page}&pageSize=${size}&ts=${ts}`
    );
    const json = await res.json();
    return json.result.content;
};

export const fetchValidators = async () => {
    const ts = Date.now();
    const res = await fetch(
        `https://attps-test.apro.com/api/ai-agent/validator?ts=${ts}`
    );
    const json = await res.json();
    return json.result.content;
};


export const fetchDetailMessage = async (dataHash: string) => {
    try {
      const ts = Date.now();
      const res = await fetch(
        `https://attps-test.apro.com/api/ai-agent/message-detail?dataHash=${dataHash}&ts=${ts}`
      );
  
      if (!res.ok) {
        console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
        return null;
      }
  
      const json = await res.json();
      return json || null; // ← return full response
    } catch (error) {
      console.error("Error fetching message detail:", error);
      return null;
    }
  };
  
  export const fetchDetailAgent = async (agentId: string, configDigest: string) => {
    try {
      const ts = Date.now();
      const res = await fetch(
        `https://attps-test.apro.com/api/ai-agent/agent-details?sourceAgentId=${agentId}&configDigest=${configDigest}&ts=${ts}`
      );
  
      if (!res.ok) {
        console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
        return null;
      }
  
      const json = await res.json();
      return json || null; // ← return full response
    } catch (error) {
      console.error("Error fetching message detail:", error);
      return null;
    }
  };
  