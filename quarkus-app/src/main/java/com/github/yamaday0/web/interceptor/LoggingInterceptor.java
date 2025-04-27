package com.github.yamaday0.web.interceptor;

import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import org.jboss.logging.Logger;

@Logged
@Interceptor
public class LoggingInterceptor {
    @Inject
    Logger logger;

    @AroundInvoke
    public Object intercept(InvocationContext ctx) throws Exception {
        String methodName = ctx.getMethod().getName();
        logger.info(String.format("Intercepting method: %s", methodName));
        long startTime = System.currentTimeMillis();
        Object[] parameters = ctx.getParameters();
        if (parameters != null) {
            for (Object parameter : parameters) {
                logger.info(String.format("Parameter: %s", parameter));
            }
        }
        try {
            return ctx.proceed();
        } catch (Exception e) {
            logger.error("Exception in method: " + methodName, e);
            throw e;
        } finally {
            long endTime = System.currentTimeMillis();
            logger.info(String.format("Method %s executed in %d ms", methodName, endTime - startTime));
        }
    }
}
