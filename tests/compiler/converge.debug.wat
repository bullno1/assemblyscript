(module
 (type $none_=>_none (func_subtype func))
 (global $~lib/memory/__data_end i32 (i32.const 8))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 32776))
 (global $~lib/memory/__heap_base i32 (i32.const 32776))
 (memory $0 0)
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
 (export "test" (func $converge/test))
 (export "memory" (memory $0))
 (func $converge/test (type $none_=>_none)
  nop
 )
)
