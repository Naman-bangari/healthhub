package com.health.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ApiLoggingAspect {

	@Before("execution(* com.health.api.CustomerApi.*(..))")
	public void logBefore(JoinPoint joinPoint) {
		System.out.println(" [Before] Calling method: "
				+ joinPoint.getSignature().getName());
	}

	@AfterReturning(pointcut = "execution(* com.health.api.CustomerApi.*(..))", returning = "result")
	public void logAfterReturning(JoinPoint joinPoint, Object result) {
		System.out.println("[AfterReturning] Method: "
				+ joinPoint.getSignature().getName() + " returned: " + result);
	}

	@AfterThrowing(pointcut = "execution(* com.health.api.CustomerApi.*(..))", throwing = "ex")
	public void logAfterThrowing(JoinPoint joinPoint, Exception ex) {
		System.out.println(
				"[AfterThrowing] Method: " + joinPoint.getSignature().getName()
						+ " threw: " + ex.getMessage());
	}
}
