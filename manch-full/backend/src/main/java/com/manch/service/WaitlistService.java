package com.manch.service;
import com.manch.dto.request.WaitlistRequest;
import java.util.Map;
public interface WaitlistService {
    Map<String,Object> joinWaitlist(WaitlistRequest req);
}
